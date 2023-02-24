import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { Product } from "./Product";

@Entity("product_tag", { schema: "mydocker03" })
export class ProductTag {
  @Column("varchar", { primary: true, name: "id", length: 36 })
  id: string;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @ManyToMany(() => Product, (product) => product.productTags)
  @JoinTable({
    name: "product_product_tags_product_tag",
    joinColumns: [{ name: "productTagId", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "productId", referencedColumnName: "id" }],
    schema: "mydocker03",
  })
  products: Product[];
}
