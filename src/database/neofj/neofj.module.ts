import { DynamicModule, Global, Module } from "@nestjs/common";
import neo4j from 'neo4j-driver';
import { NeofjService } from "./neofj.service";
import { ModuleMetadata } from '@nestjs/common/interfaces';


export interface NeofjOptions {
    uri: string
    user: string
    password: string
}
export interface NeofAsyncjOptions
    extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (
        ...args: any[]
    ) => Promise<NeofjOptions> | NeofjOptions;
    inject?: any[];
}

const CONFIG = 'config'

@Global()
@Module({})
export class NeofjModule {
    static forRootAsync(options: NeofAsyncjOptions): DynamicModule {
        return {
            module: NeofjModule,
            imports: options.imports,
            providers: [
                /**
                 * just create a provider with the Dynamic module options in the params
                 * and to import the return useFactory for the config of the db 
                 */
                { provide: CONFIG, useFactory: options.useFactory!, inject: options.inject },
                /**
                 * finaly provide the session for the exported service 
                 */
                {
                    provide: 'neo4j',
                    useFactory: async (config: NeofjOptions) => {
                        return neo4j.driver(config.uri, neo4j.auth.basic(config.user, config.password))
                    },
                    inject: [CONFIG]
                },
                NeofjService
            ],
            exports: [NeofjService],
        };
    }

}
