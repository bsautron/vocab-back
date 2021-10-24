import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NeofjModule } from "./neofj/neofj.module";

@Module({
    imports: [
        NeofjModule.forRootAsync({
            useFactory: async (config: ConfigService) => {
                return {
                    uri: config.get<string>("NEO4J_URI") as string,
                    user: config.get<string>("NEO4J_USER") as string,
                    password: config.get<string>("NEO4J_PASSWORD") as string
                }
            },
            inject: [ConfigService],
        }),

    ],
})
export class DatabaseModule {
}
