import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Comment } from '../models/Comment';
import { PostService } from '../_services/post.service';
import { User } from '../models/User';
import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.css']
})
export class CommentDialogComponent implements OnInit {
  constructor(
    // injection de dépendances
    public dialogRef: MatDialogRef<CommentDialogComponent>,
    private postService: PostService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: { comments: Comment[], postId: string } // récupère les données du post component
  ) {}

  newCommentText = ''; // The text entered by the user in the comment input field

  ngOnInit(): void {
    this.displayComments();
  }

  displayComments(): void {
    this.data.comments.forEach(comment => {
      this.postService.getUserById(comment.commentedBy).subscribe((users: User[]) => { // récupère l'utilisateur qui a commenté
        if (users && users[0]) { // pour etre sur que users[0] existe
          comment.identifiant = users[0].identifiant;
        }
      });
    });
  }

  submitComment(): void {
    if (this.newCommentText) {
      const postId = this.data.postId;  // récupère l'id du post
  
      this.postService.addCommentToMessage(postId, this.newCommentText)
        .subscribe({
          next: (result) => {
            // Assuming the result contains the updated comments array
            this.data.comments = result.comments;
            this.notificationService.addNotification('Commentaire ajouté');
            this.newCommentText = ''; // Clear the input field
            this.onClosed(); // Close the dialog
            
          },
          error: (error) => {
            console.error('Error adding comment:', error);
          }
        });
    }
  }

  onClosed(): void {
    this.dialogRef.close();
  }


  // probleme de refresh des commentaires !! 
  
}
 


