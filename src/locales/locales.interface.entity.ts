import { Field, InputType, InterfaceType, ObjectType } from "@nestjs/graphql";


@InterfaceType()
export abstract class ILocales {

    @Field({ nullable: true })
    fr?: string;

    @Field({ nullable: true })
    es?: string;
}

@ObjectType({ implements: ILocales })
export class Locales { }


// @InputType()
// export class AddLocalesPayload implements ILocales {
//     @Field({ nullable: true })
//     fr?: string;

//     @Field({ nullable: true })
//     es?: string;
// }

