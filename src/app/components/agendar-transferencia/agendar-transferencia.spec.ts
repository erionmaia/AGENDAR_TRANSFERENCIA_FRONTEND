import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarTransferencia } from './agendar-transferencia';

describe('AgendarTransferencia', () => {
  let component: AgendarTransferencia;
  let fixture: ComponentFixture<AgendarTransferencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendarTransferencia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendarTransferencia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
