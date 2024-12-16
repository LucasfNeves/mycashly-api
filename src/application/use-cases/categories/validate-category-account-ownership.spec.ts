import { describe, it, beforeEach, expect, vi } from 'vitest'
import { inMemoryCategoriesRepository } from '../../repositories/in-memory/in-memory-category-repository'
import { NotFoundException } from '../../../errors/not-found-exception'
import { ValidateCategoryOwnershipUseCase } from './validate-category-account-ownership'

describe('Authenticate User Use Case', () => {
  let categoriesRepository: inMemoryCategoriesRepository
  let sut: ValidateCategoryOwnershipUseCase
  beforeEach(() => {
    categoriesRepository = new inMemoryCategoriesRepository()
    sut = new ValidateCategoryOwnershipUseCase(categoriesRepository)
  })

  it('should return categories for given userId ', async () => {
    // Arrange
    const accountId = '1'
    const categoryId = '1'

    // Act
    const category = await sut.execute({ categoryId, accountId })

    // Assert
    expect(category).toBeTruthy()
  })

  it('should return throw NotFoundException if userId is not provided', async () => {
    // Arrange
    const accountId = 'invalid_id'
    const categoryId = '1'

    // Act
    const promise = sut.execute({ categoryId, accountId })

    // Assert
    expect(promise).rejects.toBeInstanceOf(NotFoundException)
  })

  it('should return throw NotFoundException  if categoryId is not provided', async () => {
    // Arrange
    const accountId = '1'
    const categoryId = 'invalid_id'

    // Act
    const promise = sut.execute({ categoryId, accountId })

    // Assert
    expect(promise).rejects.toBeInstanceOf(NotFoundException)
  })

  it('should call ValidateCategoryOwnershipUseCase with correct params', async () => {
    // arrange (Prepara o teste para ser executado)
    const accountId = '1'
    const categoryId = '1'

    const executeSpy = vi.spyOn(categoriesRepository, 'findFirst')

    // act (Chama o controller a ser testado)
    await sut.execute({ categoryId, accountId })

    // assert (Fazer a sua expectativa de resultado)
    expect(executeSpy).toHaveBeenCalledWith('1', '1')
  })

  it('should throw an error when repository execution fails ', async () => {
    vi.spyOn(categoriesRepository, 'findFirst').mockRejectedValue(new Error())

    // act
    const promisse = sut.execute({ categoryId: '1', accountId: '1' })

    // expect
    expect(promisse).rejects.toThrow()
  })
})
