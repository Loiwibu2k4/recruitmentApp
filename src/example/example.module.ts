import { DynamicModule, Inject, Module } from '@nestjs/common';
import { ExampleService } from './example.service';
import { ExampleController } from './example.controller';
import { MY_PROVIDER } from './provider.token';
import { ConfigurableModuleClass } from './example.module-definition';
import { Observable } from 'rxjs';

export interface AsyncConfigOptions {
  someValue: string;
  useFactory?: (...args: any[]) => Observable<any>;
  inject?: any[];
}

@Module({
  providers: []
})
export class ExampleModule extends ConfigurableModuleClass {
  static registerAsync(options: AsyncConfigOptions): DynamicModule {
    return {
      module: ExampleModule,
      providers: [
        {
          provide: MY_PROVIDER,
          useFactory: (): Observable<any> => {
            return options.useFactory()
          },
          inject: options.inject
        },
        ExampleService,
      ],
      exports: [ ExampleService],
      controllers: [ExampleController],
    };
  }
}
