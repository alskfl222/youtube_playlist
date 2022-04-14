import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SongList } from './SongList';

@Entity('song', { schema: 'ypdb' })
export class Song {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 180 })
  name: string;

  @Column('varchar', { name: 'href', length: 64 })
  href: string;

  @Column('varchar', { name: 'uploader', length: 180 })
  uploader: string;

  @Column('varchar', { name: 'uploader_href', length: 64 })
  uploader_href: string;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany(() => SongList, (songList) => songList.song)
  songLists: SongList[];
}
