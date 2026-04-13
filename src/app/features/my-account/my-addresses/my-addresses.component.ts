import { Component, inject, signal, WritableSignal } from '@angular/core';
import { InputFieldComponent } from "../../../shared/components/input-field/input-field.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsService } from '../../../core/services/settings/settings.service';
import { ToastrService } from 'ngx-toastr';
import { IAddress } from '../../../core/modules/i-address.interface';

@Component({
  selector: 'app-my-addresses',
  imports: [ReactiveFormsModule, InputFieldComponent],
  templateUrl: './my-addresses.component.html',
  styleUrl: './my-addresses.component.css',
})
export class MyAddressesComponent {
  private readonly _settingService = inject(SettingsService);
  private readonly _fb = inject(FormBuilder);
  toastr = inject(ToastrService);

  addressModuleOpen: WritableSignal<boolean> = signal(false);
  clearModule(): void {
    this.addressForm.reset();
    this.addOrEdit.set('add');
  }

  addressForm: FormGroup = this._fb.group({
    name: [null, [Validators.required]],
    details: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    city: [null, [Validators.required]]
  });
  addOrEdit: WritableSignal<'add' | 'edit'> = signal('add');
  addLoading: WritableSignal<boolean> = signal(false);
  addAddress(): void {
    if (this.addressForm.valid) {
      this.addLoading.set(true);
      this._settingService.addAddress(this.addressForm.value).subscribe({
        next: (res: any) => {
          this.clearModule();
          const newAddress = res.data[this.userAddresses().length]
          this.userAddresses.update(e => [...e, newAddress])
          this.addLoading.set(false);
          this.addressModuleOpen.set(false);
          this.toastr.success(res.message);
        },
        error: (err: any) => {
          console.log(err);
          this.clearModule();
          this.addLoading.set(false);
          this.toastr.error(err.message);
        }
      })
    }
  }

  ngOnInit(): void {
    this.getAllAddresses();
  }
  userAddresses: WritableSignal<IAddress[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);
  getAllAddresses(): void {
    this.isLoading.set(true);
    this._settingService.getAllAddresses().subscribe({
      next: (res) => {
        this.userAddresses.set(res.data);
        console.log(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      }
    })
  }

  currentId: WritableSignal<string | null> = signal(null);
  delteLoading: WritableSignal<boolean> = signal(false);
  deleteAddress(addressId: string): void {
    const confirmDelete = confirm('Are you sure you want to delete this address?');
    if (confirmDelete) {
      this.delteLoading.set(true);
      this._settingService.deleteAddress(addressId).subscribe({
        next: (res) => {
          this.delteLoading.set(false);
          this.userAddresses.update(e => e.filter(item => item._id !== addressId));
        },
        error: (err) => {
          this.delteLoading.set(false);
          this.toastr.error(err.message);
        }
      })
    }
  }

  openForEdit(address: IAddress): void {
    this.currentId.set(address._id);
    this.addOrEdit.set('edit');
    this.addressModuleOpen.set(true);
    this.addressForm.patchValue({
      name: address.name,
      details: address.details,
      phone: address.phone,
      city: address.city
    })
  }

  editAddress(): void {
    if (this.addressForm.valid) {
      this.addLoading.set(true);
      this._settingService.deleteAddress(this.currentId()!).subscribe({
        next: () => {
          this.addLoading.set(false);
          this.addAddress();
          this.getAllAddresses();
          // this.userAddresses.update(e => e.filter(item => item._id !== this.currentId()));
        },
        error: (err) => {
          this.addLoading.set(false);
          this.toastr.error(err.message);
        }
      })
    }
  }

  handleClick(): void {
    if (this.addOrEdit() == 'add') {
      this.addAddress();

    }
    if (this.addOrEdit() == 'edit') {
      this.editAddress();
    }
  }
}
