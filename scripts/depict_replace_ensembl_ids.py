#!/usr/bin/env python3
"""
Replace Ensembl IDs with Gene Symbols in TSV Files

This script reads a TSV file, identifies Ensembl IDs (ENSG* pattern),
and replaces them with their corresponding gene symbols using a mapping file.
"""

import argparse
import csv
import re
import sys
from pathlib import Path
from typing import Dict


def load_mapping(tsv_path: str) -> Dict[str, str]:
    """
    Load Ensembl ID to gene symbol mapping from a TSV file.
    
    Args:
        tsv_path: Path to the TSV file containing ensembl_id and gene_symbol columns
        
    Returns:
        Dictionary mapping Ensembl IDs to gene symbols
        
    Raises:
        FileNotFoundError: If the mapping file doesn't exist
        ValueError: If the mapping file is invalid
    """
    mapping_file = Path(tsv_path)
    if not mapping_file.exists():
        raise FileNotFoundError(f"Mapping file not found: {tsv_path}")
    
    mapping = {}
    with open(mapping_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter='\t')
        
        # Validate headers
        if 'ensembl_id' not in reader.fieldnames or 'gene_symbol' not in reader.fieldnames:
            raise ValueError(
                f"Mapping file must contain 'ensembl_id' and 'gene_symbol' columns. "
                f"Found: {reader.fieldnames}"
            )
        
        for row in reader:
            ensembl_id = row['ensembl_id'].strip().upper()
            gene_symbol = row['gene_symbol'].strip()
            if ensembl_id and gene_symbol:
                mapping[ensembl_id] = gene_symbol
    
    print(f"Loaded {len(mapping)} Ensembl ID mappings from {tsv_path}", file=sys.stderr)
    return mapping


def row_contains_duplicate_symbols(row: list, mapping: Dict[str, str], seen_symbols: set) -> bool:
    """
    Check if a row contains Ensembl IDs that map to already-used gene symbols.
    
    Args:
        row: List of cell values in the row
        mapping: Dictionary mapping Ensembl IDs to gene symbols
        seen_symbols: Set of gene symbols already used in previous rows
        
    Returns:
        True if row contains duplicate gene symbols, False otherwise
    """
    for cell in row:
        # Find all Ensembl IDs in the cell
        ensembl_ids = re.findall(r'ENSG\d+', cell, re.IGNORECASE)
        for ensembl_id in ensembl_ids:
            ensembl_id_upper = ensembl_id.upper()
            gene_symbol = mapping.get(ensembl_id_upper)
            if gene_symbol and gene_symbol in seen_symbols:
                return True
    return False


def replace_ensembl_ids(text: str, mapping: Dict[str, str], seen_symbols: set) -> tuple:
    """
    Replace all Ensembl IDs in text with their gene symbols.
    
    Args:
        text: Input text that may contain Ensembl IDs
        mapping: Dictionary mapping Ensembl IDs to gene symbols
        seen_symbols: Set of gene symbols already used (will be updated)
        
    Returns:
        Tuple of (modified_text, number_of_replacements)
    """
    replacements = 0
    
    # Pattern matches ENSG followed by digits
    # Using case-insensitive matching and converting to uppercase for lookup
    def replace_match(match):
        nonlocal replacements
        ensembl_id = match.group(0).upper()
        
        # Get the gene symbol from mapping
        gene_symbol = mapping.get(ensembl_id)
        
        if gene_symbol and gene_symbol not in seen_symbols:
            replacements += 1
            seen_symbols.add(gene_symbol)
            return gene_symbol
        else:
            # No mapping found, or symbol already used — keep original ID
            return match.group(0)
    
    modified_text = re.sub(r'ENSG\d+', replace_match, text, flags=re.IGNORECASE)
    return modified_text, replacements


def process_tsv(input_path: str, output_path: str, mapping: Dict[str, str]) -> None:
    """
    Process a TSV file, replacing Ensembl IDs with gene symbols.
    
    Args:
        input_path: Path to input TSV file
        output_path: Path to output TSV file
        mapping: Dictionary mapping Ensembl IDs to gene symbols
        
    Raises:
        FileNotFoundError: If input file doesn't exist
    """
    input_file = Path(input_path)
    if not input_file.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")
    
    output_file = Path(output_path)
    
    # Track statistics
    total_rows = 0
    rows_modified = 0
    rows_skipped = 0
    ids_replaced = 0
    
    # Track gene symbols that have been used (set for O(1) lookup)
    seen_symbols = set()
    
    with open(input_file, 'r', encoding='utf-8') as infile, \
         open(output_file, 'w', encoding='utf-8', newline='') as outfile:
        
        reader = csv.reader(infile, delimiter='\t')
        writer = csv.writer(outfile, delimiter='\t', lineterminator='\n')
        
        for row in reader:
            total_rows += 1
            
            # Check if this row contains Ensembl IDs mapping to already-used gene symbols
            if row_contains_duplicate_symbols(row, mapping, seen_symbols):
                rows_skipped += 1
                continue  # Skip this row entirely
            
            row_modified = False
            
            # Process each cell in the row
            new_row = []
            for cell in row:
                # Check if cell contains any Ensembl IDs
                if re.search(r'ENSG\d+', cell, re.IGNORECASE):
                    # Replace Ensembl IDs with gene symbols
                    new_cell, cell_replacements = replace_ensembl_ids(cell, mapping, seen_symbols)
                    if new_cell != cell:
                        row_modified = True
                        ids_replaced += cell_replacements
                    new_row.append(new_cell)
                else:
                    new_row.append(cell)
            
            if row_modified:
                rows_modified += 1

            # Track the resolved first-column value so plain gene symbols
            # (non-Ensembl IDs already in the file) are visible to later duplicate checks
            if new_row:
                seen_symbols.add(new_row[0])

            writer.writerow(new_row)
    
    print(f"\nProcessing complete:", file=sys.stderr)
    print(f"  Total rows: {total_rows}", file=sys.stderr)
    print(f"  Rows written: {total_rows - rows_skipped}", file=sys.stderr)
    print(f"  Rows skipped (duplicate gene symbols): {rows_skipped}", file=sys.stderr)
    print(f"  Rows modified: {rows_modified}", file=sys.stderr)
    print(f"  Ensembl IDs replaced: {ids_replaced}", file=sys.stderr)
    print(f"  Unique gene symbols used: {len(seen_symbols)}", file=sys.stderr)
    print(f"  Output written to: {output_path}", file=sys.stderr)


def main():
    """Main entry point for the script."""
    parser = argparse.ArgumentParser(
        description='Replace Ensembl IDs with gene symbols in TSV files',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Use default mapping file (server/gene_map_data/ensembl_gene_map.tsv)
  python depict_replace_ensembl_ids.py input.tsv output.tsv
  
  # Use custom mapping file
  python depict_replace_ensembl_ids.py input.tsv output.tsv --mapping path/to/mapping.tsv
        """
    )
    
    parser.add_argument(
        'input',
        help='Path to input TSV file'
    )
    
    parser.add_argument(
        'output',
        help='Path to output TSV file'
    )
    
    parser.add_argument(
        '--mapping',
        default=None,
        help='Path to Ensembl ID mapping TSV file (default: ../server/gene_map_data/ensembl_gene_map.tsv)'
    )
    
    args = parser.parse_args()
    
    # Determine mapping file path
    if args.mapping:
        mapping_path = args.mapping
    else:
        # Default: relative to script location
        script_dir = Path(__file__).parent
        mapping_path = script_dir / '..' / 'server' / 'gene_map_data' / 'ensembl_gene_map.tsv'
        mapping_path = mapping_path.resolve()
    
    try:
        # Load the mapping
        mapping = load_mapping(str(mapping_path))
        
        # Process the TSV file
        process_tsv(args.input, args.output, mapping)
        
        print("\n✓ Success!", file=sys.stderr)
        return 0
        
    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return 1


if __name__ == '__main__':
    sys.exit(main())
