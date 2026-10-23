import { Column, CreateDateColumn, Entity, Generated, OneToOne, PrimaryColumn, UpdateDateColumn, type Relation } from "typeorm";
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

    @OneToOne(() => MovieEntity, movie => movie.poster)
    movie: Relation<MovieEntity>

    @CreateDateColumn({
        name: 'created_at'
    })
    createAt: Date;

    @UpdateDateColumn({
        name: 'updated_at'
    })
    updatedAt: Date;
}