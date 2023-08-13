import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../service/user.service";
import {User} from "../../interface/user";
import {NotificationService} from "../../service/notification.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  @Input() user: User;

  constructor(private notificationService:NotificationService ,private router: Router, private userService:UserService) {}

  logOut(): void{

    this.userService.logOut()
    this.router.navigate(["/login"])
    this.notificationService.onSuccess("User logged out successfully");
  }

}
