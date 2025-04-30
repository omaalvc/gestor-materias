import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

console.log('Iniciando aplicación Angular');

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(ref => {
    console.log('Aplicación Angular cargada correctamente');
    // Uncomment below line for debugging
    // (window as any).ngRef = ref;
  })
  .catch(err => {
    console.error('Error al iniciar la aplicación Angular:', err);
  });
