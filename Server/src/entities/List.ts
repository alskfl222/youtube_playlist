import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SongList } from "./SongList";
import { UserList } from "./UserList";
import { User } from "./User";

@Index("user_id", ["userId"], {})
@Entity("list", { schema: "test" })
export class List {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 180 })
  name: string;

  @Column("int", { name: "user_id" })
  userId: number;

  @Column("varchar", { name: "href", length: 64 })
  href: string;

  @Column("timestamp", { name: "added_at", default: () => "CURRENT_TIMESTAMP" })
  addedAt: Date;

  @Column("tinyint", { name: "deleted", width: 1, default: () => "'0'" })
  deleted: boolean;

  @OneToMany(() => SongList, (songList) => songList.list)
  songLists: SongList[];

  @OneToMany(() => UserList, (userList) => userList.list)
  userLists: UserList[];

  @ManyToOne(() => User, (user) => user.lists, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
