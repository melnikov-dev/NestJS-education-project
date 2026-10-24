import { Column, CreateDateColumn, Entity, Generated, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn, type Relation } from "typeorm";
import { MovieEntity } from "./movie.entity.js";

@Entity({
    name: 'movie_poster'
})
export class MoviePosterEntity {
    @PrimaryColumn()
    @Generated('increment')
    id: number

    @Column({
        type: 'varchar',
        length: 256
    })
    url: string

    @Column({ name: 'movie_id', type: 'int4', unique: true })
    movieId: number;

    @OneToOne(() => MovieEntity, movie => movie.poster, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'movie_id', referencedColumnName: 'id' })
    movie: Relation<MovieEntity>;

    @CreateDateColumn({
        name: 'created_at'
    })
    createAt: Date;

    @UpdateDateColumn({
        name: 'updated_at'
    })
    updatedAt: Date;
}