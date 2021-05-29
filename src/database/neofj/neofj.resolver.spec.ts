import { Min, ValidationError } from "class-validator"
import { INode } from "./neofj.resolver"

class TestNode extends INode {
    @Min(50) numberProp?: number
    stringProp: string
    boolProp: boolean
    objProp?: Record<string, unknown>
}

describe('NeofjResolver', () => {

    describe('INode', () => {
        describe('abstract', () => {
            it('Should instanciate when extend', () => {
                class TestExt extends INode { }
                const instance = new TestExt()
                expect(instance).toBeDefined()
            })
        })
        describe('static createNode', () => {
            it('Should throw when \'id\' is not an uuid', () => {
                expect(() => INode.createNode({
                    alias: 'A',
                    instancor: TestNode,
                    props: { stringProp: 'sdfqs', boolProp: true, id: "sdf" }
                })).toThrowError(ValidationError)
            })
            it('Should not throw when \'id\' id an uuid', () => {
                const node = INode.createNode({
                    alias: 'A',
                    instancor: TestNode,
                    props: { stringProp: 'sdfqs', boolProp: true, id: "1c5e8af1-1ee0-4ac0-8364-79a9a440bb81" }
                })
                expect(node).toBeDefined()
            })
            it('Should validate class-validator', () => {
                expect(() => INode.createNode({

                    alias: 'A',
                    instancor: TestNode,
                    props: { stringProp: 'sdfqs', numberProp: 40, boolProp: true, id: "1c5e8af1-1ee0-4ac0-8364-79a9a440bb81" }
                })).toThrowError(ValidationError)

            })
        })
        describe('static createNodeWithId', () => {
            it('Should generate an id', () => {
                const node = INode.createNodeWithId({
                    alias: 'A',
                    instancor: TestNode,
                    props: { stringProp: 'sdfqs', boolProp: true }
                })
                expect(node.properties.id).toBeDefined()
            })
        })
    })

})
