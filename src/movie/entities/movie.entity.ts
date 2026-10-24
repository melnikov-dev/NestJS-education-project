import { Column, CreateDateColumn, Entity, Generated, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { ReviewEntity } from "../../review/entities/review.entity.js";
import { ActorEntity } from "../../actor/entities/actor.entity.js";
import { MoviePosterEntity } from "./movie-poster.entity.js";

export enum Genre {
    ACTION = 'action',
    COMEDY = 'comedy',
    DRAMA = 'drama',
    FANTASY = 'fantasy',
}

@Entity({
    name: 'movies'
})
export class MovieEntity {
    @PrimaryColumn()
    @Generated('increment')
    id: number

    @Column({
        type: 'varchar',
        length: 128
    })
    title: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @Column({
        type: 'numeric',
        precision: 3,
        scale: 1,
        default: 0,
    })
    rating: number;

    @Column({
        type: 'enum',
        enum: Genre,
        nullable: true,
    })
    ganre: Genre;

    @Column({
        name: 'is_released',
        type: 'boolean',
        default: false
    })
    isReleazed: boolean;

    @OneToOne(() => MoviePosterEntity, poster => poster.movie)
    poster: MoviePosterEntity | null;

    @OneToMany(() => ReviewEntity, review => review.movie)
    reviews: ReviewEntity[]

    @ManyToMany(() => ActorEntity, actor => actor.movies)
    @JoinTable({
        name: 'movies_actors',
        joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'actor_id', referencedColumnName: 'id' }
    })
    actors: ActorEntity[]

    @CreateDateColumn({
        name: 'created_at'
    })
    createAt: Date;

    @UpdateDateColumn({
        name: 'updated_at'
    })
    updatedAt: Date;
}