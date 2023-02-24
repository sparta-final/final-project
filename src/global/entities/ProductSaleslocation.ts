import { Column, Entity, OneToOne } from "typeorm";
import { Product } from "./Product";

@Entity("product_saleslocation", { schema: "mydocker03" })
export class ProductSaleslocation {
  @Column("varchar", { primary: true, name: "id", length: 36 })
  id: string;

  @Column("varchar", { name: "address", length: 255 })
  address: string;

  @Column("varchar", { name: "addressDetail", length: 255 })
  addressDetail: string;

  @Column("int", { name: "lat" })
  lat: number;

  @Column("int", { name: "lng" })
  lng: number;

  @Column("datetime", { name: "meetingTime" })
  meetingTime: Date;

  @OneToOne(() => Product, (product) => product.productSaleslocation)
  product: Product;
}
