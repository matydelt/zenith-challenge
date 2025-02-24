import ProductDto from './product.dto';

export default class OrderDto {
  userId: string;
  products: ProductDto[];
}
