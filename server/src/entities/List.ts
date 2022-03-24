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
import { PlayerList } from "./PlayerList";

@Entity("list", { schema: "ypdb" })
export class List {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 180 })
  name: string;

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

  @OneToMany(() => PlayerList, (playerList) => playerList.list)
  playerLists: PlayerList[];
}
