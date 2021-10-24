import { Min, ValidationError } from "class-validator"
import { INode } from "./neofj.resolver"

class TestNode extends INode {
    @Min(50) optionalNumberProp?: number
    requiredStringProp: string
    optionalBoolProp: boolean
    optionalObjProp?: Record<string, unknown>
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
                    props: { requiredStringProp: 'sdfqs', optionalBoolProp: true }
                })).toThrowError(ValidationError)
            })
            it('Should not throw when \'id\' id an uuid', () => {
                const node = INode.createNode({
                    alias: 'A',
                    instancor: TestNode,
                    props: { requiredStringProp: 'sdfqs', optionalBoolProp: true }
                })
                expect(node).toBeDefined()
            })
            it('Should validate class-validator', () => {
                expect(() => INode.createNode({

                    alias: 'A',
                    instancor: TestNode,
                    props: { requiredStringProp: 'sdfqs', optionalNumberProp: 40, optionalBoolProp: true }
                })).toThrowError(ValidationError)

            })
        })
        describe('static createNodeOptional', () => {
            it('Should return null when all properties are undefined', async () => {
                const node = INode.createNodeOptional({
                    alias: 'A',
                    instancor: TestNode,
                    props: { optionalBoolProp: undefined }
                })
                expect(node).toBeNull()
            })
            it('Should generate a partial node', () => {
                const node = INode.createNodeOptional({
                    alias: 'A',
                    instancor: TestNode,
                    props: { optionalBoolProp: true }
                })
                expect(node!.properties.optionalBoolProp).toBe(true)
            })
            it('Should not generate required props', () => {
                const node = INode.createNodeOptional({
                    alias: 'A',
                    instancor: TestNode,
                    props: { optionalBoolProp: true }
                })
                expect(node!.properties.requiredStringProp).not.toBeDefined()
            })
        })
        describe('static createNodeWithId', () => {
            it('Should generate an id', () => {
                const node = INode.createNodeWithId({
                    alias: 'A',
                    instancor: TestNode,
                    props: { requiredStringProp: 'sdfqs', optionalBoolProp: true }
                })
                expect(node.properties.id).toBeDefined()
                expect(node.properties.requiredStringProp).toBe('sdfqs')
                expect(node.properties.optionalBoolProp).toBe(true)
            })
        })
    })

})
