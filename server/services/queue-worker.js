

export class LocalWorker {
    constructor(app){
        this.app = app;
    }

    async dispatch(method, args){
        console.log(this.app[method])
        return await this.app[method](args.body, args.logger);
    }
}

export class EcsWorker {
    constructor(app){
        this.app = app;
    }

    async dispatch(method, args){
        console.log(this.app[method])
        return await this.app[method](args.body, args.logger);
    }
}