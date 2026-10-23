import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { MovieEntity } from "../../movie/entities/movie.entity.js";

@Entity({
    name: 'actors'
})
export class ActorEntity {
    @PrimaryColumn()
    @Generated('increment')
    id: number

    @Column({
        type: 'varchar',
        length: 128,
    })
    name: string;

    @ManyToMany(() => MovieEntity, movie => movie.actors)
    movies: MovieEntity[];

    @CreateDateColumn({
        name: 'created_at'
    })
    createAt: Date;

    @UpdateDateColumn({
        name: 'updated_at'
    })
    updatedAt: Date;
}