import { describe, it, beforeEach, expect, vi } from 'vitest'
import { inMemoryCategoriesRepository } from '../../repositories/in-memory/in-memory-category-repository'
import { GetAllCategoriesUseCase } from './get-all-categories'
import { NotFoundException } from '../../../errors/not-found-exception'

describe('Authenticate User Use Case', () => {
  let categoriesRepository: inMemoryCategoriesRepository
  let sut: GetAllCategoriesUseCase
  beforeEach(() => {
    categoriesRepository = new inMemoryCategoriesRepository()
    sut = new GetAllCategoriesUseCase(categoriesRepository)
  })

  it('should return categories for given userId ', async () => {
    // Arrange
    const userId = '1'

    // Act
    const categories = await sut.execute(userId)

    // Assert
    expect(categories).toBeTruthy()
    expect(categories).toHaveLength(12)
  })

  it('should return throw UserNotFoundError if userId is not provided', async () => {
    // Arrange
    const userId = 'invalid_id'

    // Act
    const promise = sut.execute(userId)

    // Assert
    expect(promise).rejects.toBeInstanceOf(NotFoundException)
  })

  it('should call GetAllCategoriesUseCase with correct params', async () => {
    // arrange (Prepara o teste para ser executado)

    const executeSpy = vi.spyOn(categoriesRepository, 'findyAllByUserId')

    // act (Chama o controller a ser testado)
    await sut.execute('1')

    // assert (Fazer a sua expectativa de resultado)
    expect(executeSpy).toHaveBeenCalledWith('1')
  })

  it('should throw an error when repository execution fails ', async () => {
    vi.spyOn(categoriesRepository, 'findyAllByUserId').mockRejectedValue(
      new Error(),
    )

    // act
    const promisse = sut.execute('1')

    // expect
    expect(promisse).rejects.toThrow()
  })
})
