import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { List } from "./List";

@Index("list_id", ["listId"], {})
@Index("user_id", ["userId"], {})
@Entity("user_list", { schema: "ypdb" })
export class UserList {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "user_id" })
  userId: number;

  @Column("int", { name: "list_id" })
  listId: number;

  @ManyToOne(() => User, (user) => user.userLists, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;

  @ManyToOne(() => List, (list) => list.userLists, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "list_id", referencedColumnName: "id" }])
  list: List;
}
