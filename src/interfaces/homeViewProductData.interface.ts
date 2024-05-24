export interface HomeViewProductDataInterface {
  _id: string, // productId
  name: string,
  description: string,
  image?: string,
  publicationDate?: Date,
  ownerId: string,
  likes?: number,
}
