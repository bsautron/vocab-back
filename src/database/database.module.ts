import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NeofjModule } from "./neofj/neofj.module";

@Module({
    imports: [
        NeofjModule.forRootAsync({
            useFactory: async (config: ConfigService) => {
                return {
                    uri: config.get<string>("NEOFJ_URI") ?? 'bolt://localhost',
                    user: config.get<string>("NEOFJ_USER"),
                    password: config.get<string>("NEOFJ_PASSWORD")
                }
            },
            inject: [ConfigService],
        }),

    ],
})
export class DatabaseModule {
}
