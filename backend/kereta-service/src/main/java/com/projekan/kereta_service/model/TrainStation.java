package com.projekan.kereta_service.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "train_stations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TrainStation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "city", nullable = false)
    private String city;

    private String province;

    private String region;
}