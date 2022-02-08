import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SongList } from "./SongList";

@Entity("song", { schema: "test" })
export class Song {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 180 })
  name: string;

  @Column("varchar", { name: "uploader", length: 180 })
  uploader: string;

  @Column("varchar", { name: "href", length: 64 })
  href: string;

  @Column("timestamp", { name: "added_at", default: () => "CURRENT_TIMESTAMP" })
  addedAt: Date;

  @Column("tinyint", { name: "deleted", width: 1, default: () => "'0'" })
  deleted: boolean;

  @OneToMany(() => SongList, (songList) => songList.song)
  songLists: SongList[];
}
