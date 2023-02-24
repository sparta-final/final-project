import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity("point_transaction", { schema: "mydocker03" })
export class PointTransaction {
  @Column("varchar", { primary: true, name: "id", length: 36 })
  id: string;

  @Column("varchar", { name: "impUid", length: 255 })
  impUid: string;

  @Column("int", { name: "amount" })
  amount: number;

  @Column("enum", { name: "status", enum: ["PAYMENT", "CANCEL"] })
  status: "PAYMENT" | "CANCEL";

  @Column("datetime", {
    name: "createdAt",
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.pointTransactions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "id" }])
  user: User;
}
