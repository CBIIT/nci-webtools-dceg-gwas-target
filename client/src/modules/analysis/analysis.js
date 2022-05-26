import { Suspense, useEffect, useState } from "react";
import AnalysisForm from "./analysis-form";
import Container from "react-bootstrap/Container";
import { Card } from 'react-bootstrap';
import { defaultFormState } from "./analysis.state";
import {
    SidebarContainer,
    SidebarPanel,
    MainPanel,
} from "../components/sidebar-container";

export default function Analysis() {
    const [form, setForm] = useState(defaultFormState);
    const mergeForm = (obj) => setForm({ ...form, ...obj });
    const [_openSidebar, _setOpenSidebar] = useState(true);

    useEffect(() => {
        _setOpenSidebar(form.openSidebar);
    }, [form.openSidebar]);

    return (
        <Container className="my-4">
            <SidebarContainer
                collapsed={!_openSidebar}
                onCollapsed={(collapsed) => mergeForm({ ["openSidebar"]: !collapsed })}>
                <SidebarPanel>
                    <Card className="shadow">
                        <Card.Body>
                            <AnalysisForm />
                        </Card.Body>
                    </Card>
                </SidebarPanel>
                <MainPanel>
                    <Card className="shadow h-100">
                        <Card.Body className="p-0">
                            <div className="m-2">
                                Please provide configuration settings for your analysis on
                                the left panel and click Submit.
                            </div>
                        </Card.Body>
                    </Card>
                </MainPanel>
            </SidebarContainer>

        </Container>
    );
}