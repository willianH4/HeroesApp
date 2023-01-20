import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Heroe } from '../../interfaces/heroe.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styles: [
  ]
})
export class BuscarComponent implements OnInit {

  termino: string = '';
  heroes: Heroe[] = [];
  heroeSeleccionado!: Heroe | undefined | null;

  constructor(
    private heroeService: HeroesService
  ) { }

  ngOnInit(): void {
  }

  buscando() {
    this.heroeService.getSearchHeroe( this.termino.trim() )
    .subscribe( heroes => this.heroes = heroes);
  }

  opcionSeleccionada( e:MatAutocompleteSelectedEvent ) {

    //TODO: validar si viene un string vacion evaluar
    if (!e.option.value) {
      this.heroeSeleccionado = null;
      return
    }

    const heroe: Heroe = e.option.value;
    this.termino = heroe.superhero;

    this.heroeService.getHeroeById( heroe.id! )
      .subscribe( heroe => this.heroeSeleccionado = heroe );

    }

}
