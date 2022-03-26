import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserList } from "./UserList";
import { List } from "./List";
import { Chat } from "./Chat";

@Entity("user", { schema: "ypdb" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 180 })
  name: string;

  @Column("varchar", { name: "email", nullable: true, length: 180 })
  email: string | null;

  @OneToMany(() => UserList, (userList) => userList.user)
  userLists: UserList[];

  @OneToMany(() => Chat, (chat) => chat.userId)
  chat: Chat[];
}
