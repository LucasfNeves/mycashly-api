import { v4 as uuidv4 } from 'uuid'

export class IdGeneratorAdapter {
  async execute() {
    return uuidv4()
  }
}
