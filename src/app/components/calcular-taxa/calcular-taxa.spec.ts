import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcularTaxa } from './calcular-taxa';

describe('CalcularTaxa', () => {
  let component: CalcularTaxa;
  let fixture: ComponentFixture<CalcularTaxa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalcularTaxa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalcularTaxa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
