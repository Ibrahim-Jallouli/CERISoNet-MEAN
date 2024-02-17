import { Component, OnInit, ViewChild,Renderer2 } from '@angular/core'; // j'ai essayé de faire un scroll to top mais ça marche pas 
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { PostService } from '../_services/post.service';
import Post from '../models/Post';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';
import { WebSocketService } from '../_services/webSocket.service';
import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  posts: Post[] = []; // tableau qui va contenir les posts
  currentPage = 1; // page courante
  totalItems = 0; // nombre total d'items
  pageSize = 10; // nombre d'items par page

  searchTerm = ''; // terme de recherche

  likedPosts: { [postId: number]: boolean } = {};
  searchOption: 'hashtag' | 'creator' = 'hashtag';

  // New properties for sorting
  sortBy: 'date' | 'likes' = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor( // injection de dépendances
    private postService: PostService,
    public dialog: MatDialog,
    private renderer: Renderer2,
    private webSocketService: WebSocketService,
    private notificationService: NotificationService ) {}

  ngOnInit(): void {

    this.fetchPosts(); // récupère les posts
    this.listenForLikeEvents(); // j'ai pas trouver comment/ou faire pour afficher les likes en temps réel
    // solution temporaires reload la page
  }


  // Function to toggle sorting
  toggleSortOrder(criteria: 'date' | 'likes'): void {
    if (this.sortBy === criteria) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      this.sortPosts();
    } else {
      this.sortBy = criteria;
      this.sortOrder = 'desc';  // Set default order when changing sorting criteria
      this.sortPosts();
    }
  }

  // Function to sort posts based on current criteria
  sortPosts(): void {
    if (this.sortBy === 'date') {
      this.posts.sort((a, b) => { // faire le tri par date
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    } else if (this.sortBy === 'likes') {
      this.posts.sort((a, b) => { // faire le tri par likes
        return this.sortOrder === 'asc' ? a.likes - b.likes : b.likes - a.likes;
      });
    }
  }

  // Fetch posts using the PostService
  fetchPosts(page: number = 1): void {
    this.postService.getAllMessages(page, this.pageSize) // passer la page et le nombre d'items par page
      .subscribe({
        next: (data) => {
          this.posts = data.messages; 
          console.log('Fetched posts:', this.posts);
          this.totalItems = data.totalItems; // update le nombre total d'items
          this.currentPage = data.currentPage; // update la page courante
          this.sortPosts();
          this.posts.forEach(post => {
            this.postService.getUserById(post.createdBy) // récupère l'identifiant du l'utilisateur qui a posté 
              .subscribe({
                next: (user) => {
                  console.log('Fetched user:', user);
                  if (user && user.length > 0 && user[0].identifiant) { // bad json donc il faut faire user[0].identifiant
                    post.identifiant = user[0].identifiant;
                  }
                },
                error: () => {
                  console.error("Error ");
                }
              });
          });
        },
        error: (outerError) => {
          console.error('Error fetching posts:', outerError);
        }
      });
  }
  

  // Function to handle page change event
  onPageChange(event: any): void {
    const newPage = event.pageIndex + 1; // +1 car la pagination commence a 0
    if (newPage !== this.currentPage) {
      if (this.searchOption === 'hashtag' && this.searchTerm !== '') { // handle page change when searching by hashtag
        this.searchPostsByHashtag(newPage);
      } else if (this.searchOption === 'creator' && this.searchTerm !== '') { // handle page change when searching by creator
        this.searchPostsByCreator(newPage);
      } else {
      this.fetchPosts(newPage); // else handle page change when not searching
      }
    }
    this.scrollToTop(); // ne marche pas
  }

  scrollToTop() {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0); // :')
  }

  search(): void {
    if (this.searchOption === 'hashtag') {
      this.searchPostsByHashtag();
    } else if (this.searchOption === 'creator') {
      this.searchPostsByCreator();
    }
  }

  searchPostsByHashtag(page: number = 1): void {
    // Call the searchMessagesByHashtag function with the entered hashtag
    this.postService.searchMessagesByHashtag(this.searchTerm,page, this.pageSize)
      .subscribe({
        next: (data) => {
          // Meme logique que fetchPosts
          this.posts = data.messages;
          this.totalItems = data.totalItems;
          this.currentPage = data.currentPage;  
          this.sortPosts(); // on peut faire le tri par date ou par likes
          this.posts.forEach(post => {
            this.postService.getUserById(post.createdBy)
              .subscribe({
                next: (user) => {
                  console.log('Fetched user:', user);
                  if (user && user.length > 0 && user[0].identifiant) {
                    post.identifiant = user[0].identifiant;
                  }
                },
                error: () => {
                  console.error("Error ");
                }
              });
          });
        },
        error: (error) => {
          console.error('Error searching posts by hashtag:', error);
        }
      });
      if (this.searchTerm === '') {
        this.fetchPosts();  // si le terme de recherche est vide on affiche tous les posts sans critère de recherche
      }
  }

  searchPostsByCreator(page: number = 1): void {
    // Meme logique que searchPostsByHashtag difference cote service
    this.postService.searchMessagesByCreator(this.searchTerm, page, this.pageSize)
      .subscribe({
        next: (data) => {
          console.log('TESSSSSSSST', data);
          this.posts = data.messages;
          this.totalItems = data.totalItems;
          this.currentPage = data.currentPage;
          this.sortPosts(); // on peut faire le tri par date ou par likes
          this.posts.forEach(post => {
            this.postService.getUserById(post.createdBy)
              .subscribe({
                next: (user) => {
                  console.log('Fetched user:', user);
                  if (user && user.length > 0 && user[0].identifiant) {
                    post.identifiant = user[0].identifiant;
                  }
                },
                error: () => {
                  console.error("Error ");
                }
              });
          });
        },
        error: (error) => {
          console.error('Error searching posts by creator:', error);
        }
      });
      if (this.searchTerm === '') {
        this.fetchPosts(); // si le terme de recherche est vide on affiche tous les posts sans critère de recherche
      }
  }
  
// handle likes with webSocket

  addLike(postId: number): void {
    // Update the UI instantly
    const post = this.posts.find(p => p._id === postId);
    if (post && !this.likedPosts[postId]) {
      post.likes++;
      this.likedPosts[postId] = true; 
      this.notificationService.addNotification('vous avez liké le post'+postId);
      // Emit the add-like event through WebSocket
      this.webSocketService.emitAddLike(postId);
    }
  }
  
  removeLike(postId: number): void {
    // Update the UI instantly
    const post = this.posts.find(p => p._id === postId);
    if (post && this.likedPosts[postId]) {
      post.likes--;
      this.likedPosts[postId] = false;
      this.notificationService.addNotification('vous avez unliké le post'+postId);
      // Emit the remove-like event through WebSocket
      this.webSocketService.emitRemoveLike(postId);
    }
  }
  toggleLike(postId: number): void {
    if (this.likedPosts[postId]) {
      this.removeLike(postId);
    } else {
      this.addLike(postId);
    }
  }
  
  
  updatePostLikes(updatedPost: Post, action: 'add' | 'remove'): void {
    const index = this.posts.findIndex(p => p._id === updatedPost._id); // récupère l'index du post
    if (index >= 0) { // traitement des deux cas
      if (action === 'add') { 
        this.posts[index].likes++; 
      } else if (this.posts[index].likes > 0) {
        this.posts[index].likes--;
      }
    }
  }
  listenForLikeEvents(): void {
    // Listen for add like events and update local posts
    this.webSocketService.onAddLike().subscribe((updatedPost: Post) => {
      this.notificationService.addNotification('Like ajouté pour le post ');
      this.updatePostLikes(updatedPost, 'add');
      console.log(updatedPost);
    });

    // Listen for remove like events and update local posts
    this.webSocketService.onRemoveLike().subscribe((updatedPost: Post) => {
      this.updatePostLikes(updatedPost, 'remove');
      this.notificationService.addNotification('Like supprimé pour le post ');
      console.log(updatedPost);
    });
  }


  
  // Function to open the comment dialog (you can implement this based on your needs)
  openCommentDialog(post: Post): void {
    const dialogRef = this.dialog.open(CommentDialogComponent, {
      data: { comments: post.comments, postId: post._id}, // on passe les commentaires et l'id du post
    });
  }

}
