import { Field, InputType, InterfaceType, ObjectType } from "@nestjs/graphql";


@InterfaceType()
export abstract class ALocales {

    @Field({ nullable: true })
    fr?: string;

    @Field({ nullable: true })
    es?: string;
}



// @InputType()
// export class AddLocalesPayload implements ALocales {
//     @Field({ nullable: true })
//     fr?: string;

//     @Field({ nullable: true })
//     es?: string;
// }

