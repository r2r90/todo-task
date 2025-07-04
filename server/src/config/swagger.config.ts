import { DocumentBuilder } from '@nestjs/swagger'

export function getSwaggerConfig() {
	return new DocumentBuilder()
		.setTitle('Todo Task')
		.setDescription('Technical Task for my job :)')
		.setVersion('1.0')
		.addBearerAuth()
		.build()
}