import { INode } from "./neofj.resolver"
import { NeofjService } from "./neofj.service"

class TestNode implements INode {
    id: string

    numberProp: number
    stringProp: string
    boolProp: boolean
    objProp: Record<string, unknown>
}

describe('NeofjService', () => {
    let service: NeofjService
    let session
    let neo4j

    beforeEach(() => {
        session = { run: jest.fn() }
        neo4j = {
            session: jest.fn().mockReturnValue(session),
        }
        service = new NeofjService(neo4j)
    })
    describe('runMulti', () => {
        // describe.skip('transaction', () => ({}))
        describe('session', () => {
            it('Should open a new session when call', async () => {
                await service.run([{ query: 'qsdifj' }])
                expect(neo4j.session).toBeCalledTimes(1)
            })
        })
        describe('no query', () => {
            it('Should throw when no lines given', async () => {
                await expect(service.run()).rejects.toThrowError('No query given')
                await expect(service.run(null)).rejects.toThrowError('No query given')
                await expect(service.run(undefined)).rejects.toThrowError('No query given')
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
                expect(session.run).toBeCalledWith(['Hi', 'Bruno'].join('\n'), undefined)
            })

        })
        describe('variables', () => {
            it('Should run when no variables', async () => {
                await service.run([{ query: 'Hi' }])
                expect(session.run).toBeCalledWith('Hi', undefined)
                await service.run([{ query: 'Hi', variables: null }])
                expect(session.run).toBeCalledWith('Hi', undefined)
                await service.run([{ query: 'Hi', variables: undefined }])
                expect(session.run).toBeCalledWith('Hi', undefined)
                await service.run([{ query: 'Hi', variables: [] }])
                expect(session.run).toBeCalledWith('Hi', undefined)
            })
            describe('compute', () => {

                it('Should compute when only one variable given', async () => {
                    await service.run([{ query: 'Hi', variables: [INode.createNode({ instancor: TestNode, alias: 'A', props: { boolProp: false } })] }])
                    expect(session.run).toBeCalledWith('Hi', {
                        'A': { boolProp: false }
                    })
                })
                it('Should compute complex props when no conflit', async () => {
                    await service.run([
                        {
                            query: 'Hi',
                            variables: [
                                INode.createNode({
                                    alias: 'A',
                                    instancor: TestNode,
                                    props: {
                                        id: 'coucou',
                                        numberProp: 3,
                                        stringProp: "pqif",
                                        boolProp: false,
                                        objProp: { sub: 'nope' }
                                    }
                                })
                            ]
                        }
                    ])
                    expect(session.run).toBeCalledWith('Hi', {
                        'A': {
                            id: 'coucou',
                            numberProp: 3,
                            stringProp: "pqif",
                            boolProp: false,
                            objProp: { sub: 'nope' }
                        }
                    })
                })
                it('Should compute multine line when no conflit', async () => {
                    await service.run([
                        { query: 'Hi', variables: [INode.createNode({ instancor: TestNode, alias: 'A', props: { boolProp: false } })] },
                        { query: 'Ho', variables: [INode.createNode({ instancor: TestNode, alias: 'B', props: { numberProp: 5 } })] }
                    ])
                    expect(session.run).toBeCalledWith(['Hi', 'Ho'].join('\n'), {
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


        })
    })

})