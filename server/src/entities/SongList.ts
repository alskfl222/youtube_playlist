import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Song } from "./Song";
import { List } from "./List";

@Index("list_id", ["listId"], {})
@Index("song_id", ["songId"], {})
@Entity("song_list", { schema: "test" })
export class SongList {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "song_id" })
  songId: number;

  @Column("int", { name: "list_id" })
  listId: number;

  @ManyToOne(() => Song, (song) => song.songLists, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "song_id", referencedColumnName: "id" }])
  song: Song;

  @ManyToOne(() => List, (list) => list.songLists, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "list_id", referencedColumnName: "id" }])
  list: List;
}
