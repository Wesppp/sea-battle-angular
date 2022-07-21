import {ElementRef, Injectable} from '@angular/core';
import Swal from "sweetalert2";
import {BehaviorSubject, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  providePlayerStatus = new BehaviorSubject<boolean>(false);
  playerStatusObservable$ = this.providePlayerStatus.asObservable();

  isPlayerReady(isReady: boolean) {
    this.providePlayerStatus.next(isReady)
  }

  inField(x: number, y: number) {
    return 0 <= x && x < 10 && 0 <= y && y < 10
  }

  isUnder(point: any, element: ElementRef) {
    let {x, y} = point
    let {left, top, width, height} = element.nativeElement.getBoundingClientRect()

    return left <= x && x <= left + width && top <= y && y <= top + height
  }

  getRandomBetween(min: number, max: number): number {
    return min + Math.floor(Math.random() * (max - min + 1))
  }

  getRandomFrom<T>(args: T[]): T {
    const i = Math.floor(Math.random() * args.length)
    return args[i]
  }

  convMatrix(vector: any[], col: number) {
    const matrix = [];
    while (vector.length) {
      matrix.push(vector.splice(0, col));
    }
    return matrix;
  }

  alertMessage(message: string) {
    Swal.fire(`${message}`)
  }

  popupWithConfirm(title: string, buttonText: string) {
    return Swal.fire({
      title: `${title}`,
      showConfirmButton: true,
      confirmButtonText: `${buttonText}`,
      allowOutsideClick: false
    })
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.alertMessage(error.error.text)

      console.log(`${operation} failed: ${error.message}`)

      return of(result as T);
    }
  }
}
