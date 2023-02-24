import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { ProductSaleslocation } from './ProductSaleslocation';
import { User } from './User';
import { ProductCategory } from './ProductCategory';
import { ProductTag } from './ProductTag';

@Entity('product', { schema: 'mydocker03' })
export class Product {
  @Column('varchar', { primary: true, name: 'id', length: 36 })
  id: string;

  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  @Column('varchar', { name: 'description', length: 255 })
  description: string;

  @Column('int', { name: 'price' })
  price: number;

  @Column('tinyint', { name: 'isSoldout', default: () => "'0'" })
  isSoldout: number;

  @Column('datetime', { name: 'deletedAt', nullable: true })
  deletedAt: Date | null;

  @Column('datetime', {
    name: 'updatedAt',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  updatedAt: Date;

  @OneToOne(
    () => ProductSaleslocation,
    (productSaleslocation) => productSaleslocation.product,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'productSaleslocationId', referencedColumnName: 'id' }])
  productSaleslocation: ProductSaleslocation;

  @ManyToOne(() => User, (user) => user.products, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(
    () => ProductCategory,
    (productCategory) => productCategory.products,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'productCategoryId', referencedColumnName: 'id' }])
  productCategory: ProductCategory;

  @ManyToMany(() => ProductTag, (productTag) => productTag.products)
  productTags: ProductTag[];
}
