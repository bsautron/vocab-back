
import { INode } from "./neofj.resolver"
import { NeofjService } from "./neofj.service"

class TestNode {
    numberProp?: number
    stringProp?: string
    boolProp?: boolean
    objProp?: Record<string, unknown>
}

describe('NeofjService', () => {
    let service: NeofjService;
    let session = { run: jest.fn() }
    let neo4j

    beforeEach(() => {
        session = { run: jest.fn() }
        neo4j = {
            session: jest.fn().mockReturnValue(session),
        }
        service = new NeofjService(neo4j)
    })
    describe('run', () => {
        // describe.skip('transaction', () => ({}))
        describe('session', () => {
            it('Should open a new session when call', async () => {
                await service.run([{ query: 'qsdifj' }])
                expect(neo4j.session).toBeCalledTimes(1)
            })
        })
        describe('no query', () => {
            it('Should throw when no lines given', async () => {
                await expect(service.run([])).rejects.toThrowError('No query given')
            })
            it('Should throw when empty line', async () => {
                await expect(service.run([{ query: '' }])).rejects.toThrowError('No query given')
            })
            it('Should throw when at least on line is empty', async () => {
                await expect(service.run([{ query: 'qpdifjqpifj' }, { query: '' }])).rejects.toThrowError('No query given')
            })
        })
        describe('run', () => {
            it('Should run the query when no error', async () => {
                await service.run([{ query: 'qpdifjqpifj' }])
                expect(session.run).toBeCalledTimes(1)
            })
            it('Should run then same query to the session when no error', async () => {
                await service.run([{ query: 'qsdifj' }])
                expect(session.run).toBeCalledWith('qsdifj', undefined)
            })
            it('Should concact lines when multilines given', async () => {
                await service.run([{ query: 'Hi' }, { query: 'Bruno' }])
                expect(session.run).toBeCalledWith('Hi Bruno', undefined)
            })
            it('Should throw if session.run throw', async () => {
                session.run.mockRejectedValue(new Error('Syntax Error'))
                await expect(service.run([{ query: 'Hi' }])).rejects.toThrowError('Syntax Error')

            })

        })
        describe('variables', () => {
            it('Should run when all properties are', async () => {
                await service.run([{ query: 'Hi $A.id $A.boolProp', variables: [INode.createNodeOptional({ instancor: TestNode, alias: 'A', props: { boolProp: undefined } })] }])
                expect(session.run).toBeCalledWith('Hi $A.id $A.boolProp', undefined)
            })
            it('Should run when no variables', async () => {
                await service.run([{ query: 'Hi' }])
                expect(session.run).toBeCalledWith('Hi', undefined)
                await service.run([{ query: 'Hi', variables: [] }])
                expect(session.run).toBeCalledWith('Hi', undefined)
                await service.run([{ query: 'Hi', variables: undefined }])
                expect(session.run).toBeCalledWith('Hi', undefined)
                await service.run([{ query: 'Hi', variables: [] }])
                expect(session.run).toBeCalledWith('Hi', undefined)
            })
            describe('compute', () => {

                it('Should compute when only one variable given', async () => {
                    await service.run([{ query: 'Hi $A.id $A.boolProp', variables: [INode.createNode({ instancor: TestNode, alias: 'A', props: { boolProp: false } })] }])
                    expect(session.run).toBeCalledWith('Hi $A.id $A.boolProp', {
                        'A': { boolProp: false }
                    })
                })
                it('Should compute complex props when no conflit', async () => {
                    await service.run([
                        {
                            query: 'Hi $A.id $A.numberProp $A.stringProp $A.boolProp $A.objProp.sub',
                            variables: [
                                INode.createNode({
                                    alias: 'A',
                                    instancor: TestNode,
                                    props: {
                                    
                                        numberProp: 3,
                                        stringProp: "pqif",
                                        boolProp: false,
                                        objProp: { sub: 'nope' }
                                    }
                                })
                            ]
                        }
                    ])
                    expect(session.run).toBeCalledWith('Hi $A.id $A.numberProp $A.stringProp $A.boolProp $A.objProp.sub', {
                        'A': {
                        
                            numberProp: 3,
                            stringProp: "pqif",
                            boolProp: false,
                            objProp: { sub: 'nope' }
                        }
                    })
                })
                it('Should compute multine line when no conflit', async () => {
                    await service.run([
                        { query: 'Hi $A.id $A.boolProp', variables: [INode.createNode({ instancor: TestNode, alias: 'A', props: { boolProp: false } })] },
                        { query: 'Ho $B.id $B.numberProp', variables: [INode.createNode({ instancor: TestNode, alias: 'B', props: { numberProp: 5 } })] }
                    ])
                    expect(session.run).toBeCalledWith('Hi $A.id $A.boolProp Ho $B.id $B.numberProp', {
                        'A': { boolProp: false },
                        'B': { numberProp: 5 }
                    })
                })
            })
            describe('conflit', () => {
                it('Should throw when there is alias conflit in the same line', async () => {
                    await expect(
                        service.run([{
                            query: 'Hi', variables: [
                                INode.createNode({ instancor: TestNode, alias: 'A', props: { boolProp: false } }),
                                INode.createNode({ instancor: TestNode, alias: 'A', props: { boolProp: false } })
                            ]
                        }])
                    ).rejects.toThrowError("Alias Conflit: alias 'A'")
                })
                it('Should throw when there is alias conflit with an other line', async () => {
                    await expect(service.run([
                        {
                            query: 'Hi',
                            variables: [
                                INode.createNode({ instancor: TestNode, alias: 'A', props: { stringProp: 'coucou' } })
                            ]
                        },
                        {
                            query: 'Ho',
                            variables: [
                                INode.createNode({ instancor: TestNode, alias: 'B', props: { boolProp: false } }),
                                INode.createNode({ instancor: TestNode, alias: 'A', props: { boolProp: false } }),
                            ]
                        },
                    ])
                    ).rejects.toThrowError("Alias Conflit: alias 'A'")
                })
            })
            describe('additional variables', () => {
                it('Should compute additionnal variables', async () => {
                    await service.run([{
                        query: 'Hi $A.search', variables: [
                            {
                                alias: 'A',
                                properties: {
                                    search: 'sdpion'
                                }
                            }
                        ]
                    }])
                    expect(session.run).toBeCalledWith('Hi $A.search', {
                        'A': { search: "sdpion" }
                    })

                })

            })


        })
        describe('query with variables', () => {
            it('Should throw when the query template does not countain the alias', async () => {
                await (expect(service.run([{
                    query: 'hi', variables: [
                        INode.createNodeOptional({ instancor: TestNode, alias: 'A', props: { stringProp: 'coucou' } }),
                    ]
                }]))).rejects.toThrowError("Variable '$A' provided but not found in the query")

            })
            it('Should throw when the query template does not countain the properties', async () => {
                await (expect(service.run([{
                    query: 'hi $A', variables: [
                        INode.createNodeOptional({ instancor: TestNode, alias: 'A', props: { stringProp: 'coucou' } }),
                    ]
                }]))).rejects.toThrowError("Variable '$A.stringProp' provided but not found in the query")
            })
            it('Should throw when the query template does not countain the properties fo the second query', async () => {
                await (expect(service.run([{
                    query: 'hi $A.stringProp $B.stringProp', variables: [
                        INode.createNodeOptional({ instancor: TestNode, alias: 'A', props: { stringProp: 'coucou' } }),
                        INode.createNodeOptional({ instancor: TestNode, alias: 'B', props: { stringProp: 'coucou', numberProp: 4 } }),
                    ]
                }]))).rejects.toThrowError("Variable '$B.numberProp' provided but not found in the query")
            })
            it('Should not throw when an array is given', async () => {
                await service.run([{
                    query: 'hi $A.ids', variables: [
                        {
                            alias: 'A',
                            properties: {
                                ids: ['sdf']
                            }
                        }
                    ]
                }])
                expect(session.run).toBeCalledTimes(1)
            })
        })
    })

})