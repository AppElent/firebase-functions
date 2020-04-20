import debug from 'debug';

const BASE = 'administratie-app';
const COLOURS: any = {
  trace: 'lightblue',
  info: 'blue',
  warn: 'pink',
  error: 'red',
}; // choose better colours :)

class Log {
  private debug: boolean;

  constructor(debug: boolean) {
    this.debug = debug;
  }

  generateMessage(level: string, message: any, source?: string): void {
    // Set the prefix which will cause debug to enable the message
    const namespace = `${BASE}:${level}`;
    const createDebug = debug(namespace);

    // Set the colour of the message based on the level
    createDebug.color = COLOURS[level];

    if (source) {
      createDebug(source, message);
    } else {
      createDebug(message);
    }
  }

  trace(message: any, source?: string): void {
    return this.generateMessage('trace', message, source);
  }

  info(message: any, source?: string): void {
    return this.generateMessage('info', message, source);
  }

  warn(message: any, source?: string): void {
    return this.generateMessage('warn', message, source);
  }

  error(message: any, source?: string): void {
    return this.generateMessage('error', message, source);
  }

  log(...args: any[]): void {
    if (this.debug) {
      console.log(args);
    }
  }
}

export default Log;
