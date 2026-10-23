import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn, type Relation } from "typeorm";
import { MovieEntity } from "../../movie/entities/movie.entity.js";

@Entity({
    name: 'reviews'
})
export class ReviewEntity {
    @PrimaryColumn()
    @Generated('increment')
    id: number

    @Column({
        type: 'text',
    })
    text: string;

    @Column({
        type: 'decimal',
        precision: 3,
        scale: 1,
        default: 0,
    })
    rating: number;

    @ManyToOne(() => MovieEntity, movie => movie.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'movie_id' })
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