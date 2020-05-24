import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodosAccess } from '../../dataLayer/todosAccess'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../../lambda/utils'

const logger = createLogger('todos')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  if (newTodo.name.trim() == "") {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: `TODO Name Can't be empty`
      })
    }
  }
  const userId = getUserId(event)
  logger.info(`Create Todo for user ${userId} with data ${newTodo}`)

  const todo = await new TodosAccess().createTodo(newTodo, userId)

  return {
    statusCode: 201,
    body: JSON.stringify({
      item: todo
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)

