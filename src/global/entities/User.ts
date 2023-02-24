import { Column, Entity, OneToMany } from "typeorm";
import { PointTransaction } from "./PointTransaction";
import { Product } from "./Product";

@Entity("user", { schema: "mydocker03" })
export class User {
  @Column("varchar", { primary: true, name: "id", length: 36 })
  id: string;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("int", { name: "age" })
  age: number;

  @Column("int", { name: "point" })
  point: number;

  @OneToMany(
    () => PointTransaction,
    (pointTransaction) => pointTransaction.user
  )
  pointTransactions: PointTransaction[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
