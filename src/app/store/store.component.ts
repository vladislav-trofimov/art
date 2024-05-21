import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSelectChange } from '@angular/material/select';
@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent {

  constructor(private http: HttpClient ) { }

  images: any[] = [];
  serverName = 'http://localhost:3000';

  categories = [
    {id: 1, name: 'Modern'},
    {id: 2, name: 'Classic'},
    {id: 3, name: 'Anime'},
    {id: 4, name: 'Custom'},
    {id:0, name: 'All'}
  ];

  ngOnInit() {
    this.sendRequest(null);
  }

  onSelectionChange(event: MatSelectChange) {
    this.sendRequest(event.value);
  }

  sendRequest(categoryId: number | null) {
    const category = categoryId ? `?category_id=${categoryId}` : '';
    this.http.get(`${this.serverName}/images${category}`).subscribe(
      (response: any) => {
        this.images = response;
        this.images = this.images.map((image) => {
          return {
            ...image,
            url: `${this.serverName}/${image.file_path}`,
          };
        });
        console.log('Images', this.images);
      },
      (error) => console.error('Request failed', error)
    );
  }
}
