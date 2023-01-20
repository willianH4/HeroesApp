import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';
import { Heroe, Publisher } from '../../interfaces/heroe.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [
    `
    img {
      width: 100%;
      border-radius: 5px;
      max-height: 400px
    }
    `
  ]
})
export class AgregarComponent implements OnInit {

  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ]

  //TODO: Declaracion de objeto para asociarlos a los campos del formulario
  // esto facilita el envio de la data a la base de datos.
  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: ''
  }

  constructor(
    private matDialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private heroeService: HeroesService,
    private activatedRoute: ActivatedRoute // para leer parametros de la url
  ) { }

  ngOnInit(): void {
    if ( !this.router.url.includes('editar') ) {
      return;
    }
    this.activatedRoute.params
    .pipe(
      switchMap( ({ id }) => this.heroeService.getHeroeById( id ) )
    )
    .subscribe(heroe => this.heroe = heroe);
  }

  guardar() {
    // TODO: Valida que el nombre no venga vacio
    if ( this.heroe.superhero.trim().length == 0 )  {
      return;
    }

    if ( this.heroe.id ) {
      //TODO: actualizar el registro
      this.heroeService.updateHeroe( this.heroe )
    .subscribe( resp => {
      this.showSnackBar("Registro actualizado");
    } )
    }else {
      //TODO: guardar un registro
      this.heroeService.addHeroe( this.heroe )
    .subscribe( resp => {
      this.router.navigate(['/heroes/editar', resp.id]);
      this.showSnackBar("Registro creado");
    } )
    }

  }

  borrarHeroe() {

    const dialog = this.matDialog.open(ConfirmarComponent, {
      width: '250px',
      data: this.heroe
    });

    dialog.afterClosed().subscribe( //puede implementarse el switchMap
      (result) => {
        if (result) {
          // TODO: Borrar el registro
          this.heroeService.deleteHeroe( this.heroe.id! )
          .subscribe(resp => {
            this.router.navigate(['/heroes']);
          })
        }
      }
    )
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'ok!', {
      duration: 2000
    })
  }

}
