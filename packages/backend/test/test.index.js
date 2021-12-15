import { delogger }         from '@spare/deco'
import { decoFunc, logger } from '@spare/logger'
import { backend }           from '..'
import { backend }           from '../src/backend'

const func = x => x
const newFunc = new Function('x', 'return x + 1')
func.name |> delogger
backend(func, 'bye-bye')
func.name |> delogger

newFunc.name |> delogger
newFunc |> backend('some(Func)')
newFunc.name |> delogger
newFunc |> decoFunc |> logger
