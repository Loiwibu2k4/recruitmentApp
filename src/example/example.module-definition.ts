import { ConfigurableModuleBuilder } from '@nestjs/common';
import { AsyncConfigOptions } from './example.module';
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } 
    = new ConfigurableModuleBuilder<AsyncConfigOptions>()
    .setExtras(
        {
          isGlobal: true,
        },
        (definition, extras) => ({
          ...definition,
          global: extras.isGlobal,
        }),
      )
    .setClassMethodName('registerAsync').build();