import { DynamicModule, LoggerService, Module } from '@nestjs/common';

@Module({})
export class IntegrationsModule {
  public static async register(
    ids: string[],
    logger?: LoggerService
  ): Promise<DynamicModule> {
    const modules = await IntegrationsModule.resolveModules(ids, logger);

    return {
      module: IntegrationsModule,
      imports: modules
    };
  }

  private static resolveModules(
    ids: string[],
    logger?: LoggerService
  ): Promise<DynamicModule[]> {
    const loadedModules: Array<Promise<DynamicModule>> = [];

    logger?.log(
      `Loading integrations: ${ids?.length > 0 ? ids.join(', ') : 'none'}`,
      IntegrationsModule.name
    );
    ids.forEach(id => {
      const loadPromise = IntegrationsModule.loadModule(
        `./${id}/${id}.module`
      ).then(module => module.default.forRoot());
      loadedModules.push(loadPromise);
    });

    return Promise.all(loadedModules);
  }

  private static loadModule(path: string): Promise<any> {
    return import(path);
  }
}
