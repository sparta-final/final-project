import { Column, Entity, Index, OneToMany } from "typeorm";
import { Product } from "./Product";

@Index("IDX_96152d453aaea425b5afde3ae9", ["name"], { unique: true })
@Entity("product_category", { schema: "mydocker03" })
export class ProductCategory {
  @Column("varchar", { primary: true, name: "id", length: 36 })
  id: string;

  @Column("varchar", { name: "name", unique: true, length: 255 })
  name: string;

  @OneToMany(() => Product, (product) => product.productCategory)
  products: Product[];
}
