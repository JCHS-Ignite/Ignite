const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v10');
const Team = require('../../schema/Team');
const User = require('../../schema/User');
const genUuid = require('../../util/genUuid');

module.exports = {
  async execute(interaction) {
    const command = interaction.options.getSubcommand();

    const user = await User.findOne({ discordId: interaction.user.id });

    if (!user.riotNickname) {
      await interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setTitle('오류 발생')
            .setDescription(`승부 예측을 만들기 전 라이엇 계정과 연동해주세요.`)
            .setColor(0xff5252),
        ],
      });
    } else {
      if (command === '시작') {
        const uuid = genUuid();
        const teams = await Team.find({});

        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle('승부 예측 등록')
              .addField('[팀1]', '팀을 선택해주세요. ')
              .addField('[팀2]', '팀을 선택해주세요.')
              .setColor(0x66ccff),
          ],
          components: [
            new MessageActionRow().addComponents(
              new MessageSelectMenu()
                .setCustomId(`prediction_team1`)
                .setOptions(
                  teams.map((team) => ({
                    label: `${team.name}`,
                    description: `${team.grade}-${team.class}`,
                    value: `${team._id}`,
                  })),
                )
                .setPlaceholder('1팀을 선택해주세요.'),
            ),
            new MessageActionRow().addComponents(
              new MessageSelectMenu()
                .setCustomId(`prediction_team2`)
                .setOptions(
                  teams.map((team) => ({
                    label: `${team.name}`,
                    description: `${team.grade}-${team.class}`,
                    value: `${team._id}`,
                  })),
                )
                .setPlaceholder('2팀을 선택해주세요.'),
            ),
            new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setCustomId(`prediction_confirm-${uuid}`)
                  .setLabel('등록')
                  .setStyle('SUCCESS')
                  .setDisabled(true),
              )
              .addComponents(
                new MessageButton()
                  .setCustomId('prediction_exit')
                  .setLabel('취소')
                  .setStyle('DANGER'),
              ),
          ],
        });
      } else if (command === '종료') {
      }
    }
  },
  data: new SlashCommandBuilder()
    .setName('승부예측')
    .setDescription('[관리자] 승부 예측 시스템을 관리합니다.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addSubcommand((command) => command.setName('시작').setDescription('승부예측을 시작합니다.'))
    .addSubcommand((command) => command.setName('종료').setDescription('승부예측을 종료합니다.')),
};